import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class Camera {
  id: string;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class CameraUtilService {

  getAvailable(): Observable<Camera[]> {
    return from(navigator.mediaDevices.enumerateDevices()).pipe(
      map((devices: any[]) => devices
        .filter(device => device.kind === 'videoinput')
        .map((device, index) => {
          const camera = new Camera();
          camera.id = device.deviceId;
          camera.title = device.label || `Camera ${index + 1}`;
          return camera;
        }))
    );
  }

  getStream(cameraId: string): Observable<MediaStream> {
    return from(navigator.mediaDevices.getUserMedia({peerIdentity: cameraId, video: true, audio: false}));
  }
}
