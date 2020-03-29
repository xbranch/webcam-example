import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Camera, CameraUtilService } from './core/util/camera-util.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private stream: MediaStream;

  private cameras: BehaviorSubject<Camera[]> = new BehaviorSubject([]);
  private current: BehaviorSubject<string> = new BehaviorSubject(null);

  cameras$: Observable<Camera[]> = this.cameras.asObservable();
  current$: Observable<string> = this.current.asObservable();

  hasCameras$: Observable<boolean> = this.cameras$.pipe(map(cameras => cameras && cameras.length > 0));

  @ViewChild('video') video: ElementRef<HTMLVideoElement>;
  @ViewChild('capture') capture: ElementRef<HTMLCanvasElement>;
  @ViewChild('snapshot') snapshot: ElementRef<HTMLDivElement>;

  constructor(private cameraUtil: CameraUtilService) {
  }

  ngOnInit(): void {
    this.cameraUtil.getAvailable().subscribe(cameras => {
      if (cameras && cameras.length > 0) {
        this.start(cameras[0].id);
      }
      this.cameras.next(cameras || []);
    }, console.error);
  }

  ngOnDestroy(): void {
    this.cameras.complete();
    this.current.complete();
    this.stop();
  }

  start(cameraId: string): void {
    this.stop();
    this.cameraUtil.getStream(cameraId).subscribe((stream: MediaStream) => {
      this.stream = stream;
      this.video.nativeElement.srcObject = stream;
      this.video.nativeElement.play();
      this.current.next(cameraId);
    });
  }

  stop(): void {
    if (!this.stream) {
      return;
    }
    const track = this.stream.getTracks()[0];
    track.stop();
    this.video.nativeElement.load();
    this.current.next(null);

    this.stream = null;
  }

  snap(): void {
    if (!this.stream) {
      return;
    }

    const capture = this.capture.nativeElement;
    const snapshot = this.snapshot.nativeElement;

    const videoBCR = this.video.nativeElement.getBoundingClientRect();

    const ctx = capture.getContext('2d');
    ctx.drawImage(this.video.nativeElement, 0, 0, capture.width, capture.height);

    const img = new Image();
    img.src = capture.toDataURL('image/png');
    img.width = videoBCR.width / 2;
    img.height = videoBCR.height / 2;
    img.className = `rounded d-inline mb-3 mr-2`;

    snapshot.prepend(img);
  }
}
