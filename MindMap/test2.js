import * as THREE from '../build/three.module.js';

export function initializeScene(div) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    div.appendChild(renderer.domElement);
    camera.position.z = 5;

    return { scene, renderer, camera };
}

export async function renderMindMap(div) {
    const { scene, renderer, camera } = initializeScene(div);
    const mindMapNode = await renderToSprite("<MindMapNode xmlns='http://www.w3.org/1999/xhtml' level='0' label='Interests'>asdfqwerasdfqwer</MindMapNode>", 600, 450);
    scene.add(mindMapNode);
    renderer.render(scene, camera);
}

function loadImage(url) {
    const image = new window.Image();
    return new Promise((resolve) => {
        image.onload = () => resolve(image);
        image.src = url;
    });
}

export async function renderToCanvas(content, width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    /* 동작하는 예시
    const url = `data:image/svg+xml,
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'>
<polygon
        fill='rgba(23, 114, 248, 0.999)'
        points='20.62 55.62 45.74 30.5 20.62 5.38 16.38 9.62 37.26 30.5 16.38 51.38 20.62 55.62'/>
</svg>`;
    */

    const url = `data:image/svg+xml,
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                   <style>
                            html {
            box-sizing: border-box;
        }

        *,
        *:before,
        *:after {
            box-sizing: inherit;
        }

        body {
            font-family: sans-serif;
            margin: 0;
            padding: 0;
        }

        foreignObject {
            box-sizing: border-box;
            font-family: sans-serif;
        }

        MindMapNode {
            background-color: white;
            padding: 10px;
            width: 120px;
            height: 60px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-width: 3px;
            border-style: solid;
            border-radius: 12px;
            text-align: center;
            font-weight: bold;
        }

        .magenta {
            color: rgb(241, 3, 200);
            border-color: rgb(241, 3, 200);
            background-color: rgb(251, 175, 238);
        }

        .violet {
            color: rgb(134, 3, 241);
            border-color: rgb(134, 3, 241);
            background-color: rgb(215, 166, 254);
        }

        .blue {
            color: rgb(0, 100, 210);
            border-color: rgb(0, 100, 210);
            background-color: rgb(176, 213, 254);
        }

        .turquoise {
            color: rgb(3, 211, 207);
            border-color: rgb(3, 211, 207);
            background-color: rgb(190, 254, 253);
        }

                    div {
                      color: white;
                      font: 18px serif;
                      height: 100%;
                      overflow: auto;
                    }
                  </style>

              <foreignObject width="${width}" height="${height}">
                    ${content}
                    <MindMapNode xmlns="http://www.w3.org/1999/xhtml">
                        First Thing
                    </MindMapNode>
                    <div xmlns="http://www.w3.org/1999/xhtml">
                        sadlfjwqoeirjsadlkjf
                        qwoerijsdlanv
                    </div>
              </foreignObject>
            </svg>`;

    const image = await loadImage(url);
    ctx.drawImage(image, 0, 0);

    return canvas;
}

export async function renderToSprite(content, width, height) {
    const canvas = await renderToCanvas(content, width, height);

    const map = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(width / 100, height / 100, 0.1);

    return sprite;
}


export function MindMapNode(level, label) {

    let color = "";
    if (level == 0)
        color = "magenta";
    else if (level == 1)
        color = "violet";
    else if (level == 2)
        color = "blue";
    else if (level >= 3)
        color = "turquoise";

    return "<div\
            xmlns='http://www.w3.org/1999/xhtml'\
            class=\
            'mind-map-node " + color + "'>\
            <div>" + label + "</div>\
        </div>";
}

