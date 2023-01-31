import * as THREE from '../build/three.module.js';

export class mindMapApp {

    constructor(name, divElem) {

        this._name = name;

        this._div = divElem;

        // this._div.innerHTML = this.appElementHTML(name);


        mindMapApp.I = this;
    }

    appElementHTML(name) {
        let ihtml = [];

        let idx = 0;

        ihtml[idx] = "<div class='mindMap_rbase' id='" + name + "_rbase'></div>";
        idx++;
    }

    createRenderer() {
        let renderer = new THREE.WebGLRenderer();

        let scrWidth = this._div.offsetWidth;
        let scrHeight = this._div.offsetHeight;


    }

    initApp() {
        this.renderMindMap(this._div);
    }

    render() {
        requestAnimationFrame(render);


    }


    initializeScene(div) {
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

    async renderMindMap(div) {
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
        const geometry = new THREE.BoxGeometry();
        const canvas = document.createElement('canvas');

        var myCanvas = document.getElementById("canvas");
        var context = canvas.getContext('2d');
        context.fillRect(50, 50, 100, 100);

        let base_image = new Image();
        base_image.src = 'images/base.png';
        base_image.onload = function () {
            context.drawImage(base_image, 0, 0);
        }


        const width = 120;
        const height = 60;
        const Component = '<MindMapNode level={0} label="Interests" />';
        await mindMapApp.I.renderToCanvas(
            canvas,
            width,
            height,
            Component
        );
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        camera.position.z = 5;
        function animate() {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        }
        animate();
    }

    async renderToSprite(canvas, content, width, height ) {
        canvas = await mindMapApp.I.renderToCanvas(canvas, content,
            width,
            height,
        );
        const map = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(width / 100, height / 100, 0.1);
        return sprite;
    }

    async renderToCanvas(
        canvas,
        width,
        height,
        content
    ) {
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        const url = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
      <style type="text/css">
               <![CDATA[
          ${document.getElementById('styles').innerHTML}
        ]]>
      </style>
      <foreignObject width=${width} height=${height}>
        ${content}
      </foreignObject>
      </svg>`;
        const image = await mindMapApp.I.loadImage(url);
        ctx.drawImage(image, 0, 0);

        return canvas;
    }

    loadImage(url) {
        const image = new window.Image();
        return new Promise((resolve) => {
            image.onload = () => resolve(image);
            image.src = url;
        });
    }

}