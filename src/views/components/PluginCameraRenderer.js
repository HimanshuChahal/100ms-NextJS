import React from 'react'
import { HMSVideoPluginType } from "@100mslive/hms-video";
import { Pose, POSE_CONNECTIONS } from "@mediapipe/pose";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

const pose = new Pose({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    },
});
pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: true,
    smoothSegmentation: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
    selfieMode: true,
});

function drawAngles(start, midpoint, endpoint, ctx, width, height) {
    // console.log(start, midpoint, endpoint);
    const diffX = start.x - midpoint.x;
    const diffY = start.y - midpoint.y;
    // const radius = Math.abs(Math.sqrt(diffX * diffX + diffY * diffY));
    const radius = 30;
    const startAngle = Math.atan2(diffY, diffX);
    const endAngle = Math.atan2(
        endpoint.y - midpoint.y,
        endpoint.x - midpoint.x
    );
    ctx.lineWidth = 5
    ctx.strokeStyle = 'white'
    ctx.beginPath();
    ctx.arc(midpoint.x * width, midpoint.y * height, radius, startAngle, endAngle);
    ctx.stroke();

    ctx.font = "30px Arial"
    ctx.fillStyle = 'white'
    ctx.fillText(Math.floor(Math.abs(((startAngle - endAngle) * 180 / Math.PI))), midpoint.x * width - 80, midpoint.y * height);
}

export default class GrayscalePlugin {
    getName() {
        return "grayscale-plugin";
    }

    isSupported() {
        return true;
    }

    async init() {
        // pose.onResults(this.onResults);
    }

  // onResults(results) {
  //   const canvasCtx = canvasRef.current.getContext("2d");
  //   canvasCtx.save();
  //   canvasCtx.clearRect(
  //     0,
  //     0,
  //     canvasRef.current.width,
  //     canvasRef.current.height
  //   );
  //   canvasCtx.globalCompositeOperation = "source-in";
  //   canvasCtx.fillStyle = "#00FF00";
  //   canvasCtx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  // }

    getPluginType() {
        return HMSVideoPluginType.TRANSFORM;
    }

    stop() {}

    /**
     * @param input {HTMLCanvasElement}
     * @param output {HTMLCanvasElement}
   */
    async processVideoFrame(input, output) {
        await pose.send({ image: input });

        pose.onResults((results) => {
            const width = input.width;
            const height = input.height;

            output.width = width;
            output.height = height;
            const inputCtx = input.getContext("2d");
            const outputCtx = output.getContext("2d");
            const imgData = inputCtx.getImageData(0, 0, width, height);

            const canvasCtx = outputCtx;
            const canvasElement = output;

            if (!results.poseLandmarks) {
                return;
            }

            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            // canvasCtx.drawImage(
            //   results.segmentationMask,
            //   0,
            //   0,
            //   canvasElement.width,
            //   canvasElement.height
            // );

            // Only overwrite existing pixels.
            canvasCtx.globalCompositeOperation = "source-in";
            canvasCtx.fillStyle = "#00FF00";
            canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

            // Only overwrite missing pixels.
            canvasCtx.globalCompositeOperation = "destination-atop";
            canvasCtx.drawImage(
                results.image,
                0,
                0,
                canvasElement.width,
                canvasElement.height
            );

            canvasCtx.globalCompositeOperation = "source-over";

            drawAngles(results.poseLandmarks[24], results.poseLandmarks[26], results.poseLandmarks[28], canvasCtx, width, height);

            drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
                color: "white",
                lineWidth: 4,
            });
            drawLandmarks(canvasCtx, results.poseLandmarks, {
                color: "green",
                lineWidth: 2,
            });
            canvasCtx.restore();
        });
    }
}
