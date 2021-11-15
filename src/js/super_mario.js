import * as THREE from 'three'

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

let container

let camera, scene, renderer

let windowHalfX = window.innerWidth / 2
let windowHalfY = window.innerHeight / 2

var object,
	cloud,
	textMesh,
	sound,
	coinsScore = 0,
	runScore = 0,
	coinLoader,
	coinMaterial

var coinSpan = document.querySelector('#coins')

var runSpan = document.querySelector('#run')

init()
animate()

function loadAudioObject() {
	// create an AudioListener and add it to the camera
	const listener = new THREE.AudioListener()
	camera.add(listener)

	// create a global audio source
	sound = new THREE.Audio(listener)

	// load a sound and set it as the Audio object's buffer
	const audioLoader = new THREE.AudioLoader()
	audioLoader.load('../src/sounds/jump.wav', function (buffer) {
		console.log('[INFO] coin child match', buffer)
		// buffer.setLoop(1)
		sound.setBuffer(buffer)
		sound.setVolume(0.9)
		// sound.play()
		// sound.setLoop(1)
		// setTimeout(function () {
		// 	sound.pause()
		// }, 2)

		// return sound
	})
}

function getCoin() {
	if (object) {
		let playerPosition = object.position.x

		scene?.children.forEach((child) => {
			if (child.uuid === 'brick') {
				if (
					// child.position.x - 3 <
					// playerPosition <
					// child.position.x + 3

					child.position.x - 3 === playerPosition ||
					child.position.x - 2 === playerPosition ||
					child.position.x - 1 === playerPosition ||
					child.position.x === playerPosition ||
					child.position.x + 1 === playerPosition ||
					child.position.x + 2 === playerPosition
				) {
					console.log('[INFO] coin child match')
					var currentCoin = goldCoin()
					currentCoin.position.x = child.position.x
					currentCoin.position.y = child.position.y
					scene.add(currentCoin)

					setTimeout(function () {
						child.position.y -= 5
						currentCoin.position.y -= 5
						sound.stop()
						scene.remove(currentCoin)
					}, 1000)

					setTimeout(function () {
						child.position.y += 5
						currentCoin.position.y += 20

						sound.play()
						coinsScore += 1
						coinSpan.innerHTML = `Coins : ${coinsScore}`
					}, 500)
					// child.position.y += 5
					// currentCoin.position.y += 40

					// sound.play()
					// coinsScore += 1
					// coinSpan.innerHTML = `Coins : ${coinsScore}`
					// loadAudioObject()

					// child.isMesh
				}
			}
		})
	}
}

function goldCoin() {
	// // Create a texture loader so we can load our image file
	// var coinLoader = new THREE.TextureLoader()

	// // Load an image file into a custom material
	// var coinMaterial = new THREE.MeshBasicMaterial({
	// 	map: coinLoader.load('../src/img/gold.png'),
	// })

	// create a plane geometry for the image with a width of 10
	// and a height that preserves the image's aspect ratio
	var coinGeometry = new THREE.CircleGeometry(5, 32)

	// combine our image geometry and material into a mesh
	var mesh = new THREE.Mesh(coinGeometry, coinMaterial)
	var randomCloudPosition = [45, 50, 55, 60, 65]

	mesh.position.y =
		randomCloudPosition[Math.floor(Math.random() * randomCloudPosition.length)]
	mesh.uuid = 'gold_coin'
	// scene.add(mesh)
	return mesh
}

// Generate Text

function init() {
	// container = document.createElement('div')
	// document.body.appendChild(container)

	camera = new THREE.PerspectiveCamera(
		45,
		window.innerWidth / window.innerHeight,
		1,
		2000
	)
	camera.position.z = 200

	// scene
	const texture1 = new THREE.TextureLoader().load('../src/img/sky1.png')
	texture1.wrapS = THREE.RepeatWrapping
	texture1.wrapT = THREE.RepeatWrapping

	const texture2 = new THREE.TextureLoader().load('../src/img/brick.jpg')
	texture2.wrapS = THREE.RepeatWrapping
	texture2.wrapT = THREE.RepeatWrapping
	// texture1.repeat.set(4, 4)

	// Create a texture loader so we can load our image file
	coinLoader = new THREE.TextureLoader()

	// Load an image file into a custom material
	coinMaterial = new THREE.MeshBasicMaterial({
		map: coinLoader.load('../src/img/gold.png'),
	})

	scene = new THREE.Scene()
	scene.background = texture1

	// Set Score and Coins
	coinSpan.innerHTML = `Coins : ${coinsScore}`
	runSpan.innerHTML = `Score : ${runScore}`

	const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4)
	scene.add(ambientLight)

	const pointLight = new THREE.PointLight(0xffffff, 0.8)
	camera.add(pointLight)
	scene.add(camera)

	// load audioLoader
	loadAudioObject()

	// manager

	function loadModel() {
		object &&
			object.traverse(function (child) {
				if (child.isMesh) child.material.map = texture
			})
		if (object) {
			object.position.y = -40
			// object.rotation.y = 1.5
			object.scale.multiplyScalar(8)
			console.log(object)
			scene.add(object)
		}
	}

	const manager = new THREE.LoadingManager(loadModel)

	manager.onProgress = function (item, loaded, total) {
		console.log(item, loaded, total)
	}

	// texture

	const textureLoader = new THREE.TextureLoader(manager)
	const texture = textureLoader.load('../src/img/mario-bg.png')

	// scoreText = createText('Score')
	// // scoreText?.position?.x = -130
	// scene.add(scoreText)

	// geometry
	// const brickBox = new THREE.BoxGeometry(
	// 	window.innerWidth / 4,
	// 	window.innerHeight / 8,
	// 	10
	// )
	const brickBox = new THREE.PlaneGeometry(
		window.innerWidth * 4,
		window.innerHeight / 8
	)
	const brickMaterial = new THREE.MeshBasicMaterial({
		map: texture2,
	})
	brickMaterial.map.wrapS = THREE.RepeatWrapping
	brickMaterial.map.wrapT = THREE.RepeatWrapping
	brickMaterial.map.repeat.set(20, 2)
	// const brickMaterial = texture2
	const brickBase = new THREE.Mesh(brickBox, brickMaterial)
	brickBase.position.y = -78
	scene.add(brickBase)

	// load image
	function loadCloudImage() {
		// Create a texture loader so we can load our image file
		var cloudLoader = new THREE.TextureLoader()

		// Load an image file into a custom material
		var cloudMaterial = new THREE.MeshBasicMaterial({
			map: cloudLoader.load('../src/img/cloud.png'),
		})

		// create a plane geometry for the image with a width of 10
		// and a height that preserves the image's aspect ratio
		var cloudGeometry = new THREE.PlaneGeometry(30, 30 * 0.55)

		// combine our image geometry and material into a mesh
		var mesh = new THREE.Mesh(cloudGeometry, cloudMaterial)
		var randomCloudPosition = [45, 50, 55, 60, 65]

		mesh.position.y =
			randomCloudPosition[
				Math.floor(Math.random() * randomCloudPosition.length)
			]
		mesh.uuid = 'cloud'
		return mesh
		// scene.add(mesh)
	}
	loadCloudImage()

	function generateRandomClouds() {
		// create an array of random int from 40 to 400
		const randomPoints = []
		let start = 40
		while (start < 800) {
			randomPoints.push(start)
			start += Math.floor(Math.random() * 50) + 70
		}
		// for (let i = 0; i < 20; i++) {
		// 	randomPoints.push(Math.floor(Math.random() * 200) + 40)
		// }
		console.log(randomPoints)
		randomPoints.forEach((point) => {
			let cloudMesh = loadCloudImage()
			cloudMesh.position.x = point
			scene.add(cloudMesh)
		})
	}
	generateRandomClouds()

	function loadPointsBrick() {
		// Create a texture loader so we can load our image file
		var pointsBrickLoader = new THREE.TextureLoader()

		// Load an image file into a custom material
		var pointsBrickMaterial = new THREE.MeshBasicMaterial({
			map: pointsBrickLoader.load('../src/img/brick_coin.jpg'),
		})

		// create a plane geometry for the image with a width of 10
		// and a height that preserves the image's aspect ratio
		var pointsBrickGeometry = new THREE.PlaneGeometry(10, 10)

		// combine our image geometry and material into a mesh
		var pointBrickMesh = new THREE.Mesh(
			pointsBrickGeometry,
			pointsBrickMaterial
		)
		pointBrickMesh.position.y = 10
		pointBrickMesh.uuid = 'brick'
		return pointBrickMesh
		pointBrickMesh.position.x = 40

		scene.add(pointBrickMesh)
	}
	loadPointsBrick()

	function generateRandomPoints() {
		// create an array of random int from 40 to 400
		const randomPoints = []
		let start = 40
		while (start < 800) {
			randomPoints.push(start)
			start += Math.floor(Math.random() * 50) + 20
		}
		// for (let i = 0; i < 20; i++) {
		// 	randomPoints.push(Math.floor(Math.random() * 200) + 40)
		// }
		console.log(randomPoints)
		randomPoints.forEach((point) => {
			let pointsMesh = loadPointsBrick()
			pointsMesh.position.x = point
			scene.add(pointsMesh)
		})

		// var points =
	}
	generateRandomPoints()

	// model

	function onProgress(xhr) {
		if (xhr.lengthComputable) {
			const percentComplete = (xhr.loaded / xhr.total) * 100
			console.log('model ' + Math.round(percentComplete, 2) + '% downloaded')
		}
	}

	function onError() {
		alert('Error loading model')
	}

	const loader = new OBJLoader(manager)
	loader.load(
		'../src/models/Super_Mario.obj',
		function (obj) {
			object = obj
		},
		onProgress,
		onError
	)

	//

	renderer = new THREE.WebGLRenderer({
		canvas: document.querySelector('#mario'),
	})
	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.setSize(window.innerWidth, window.innerHeight)

	//

	window.addEventListener('resize', onWindowResize)

	// add event listener for arrow keys
	window.addEventListener('keydown', onKeyDown)
}

function onWindowResize() {
	windowHalfX = window.innerWidth / 2
	windowHalfY = window.innerHeight / 2

	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()

	renderer.setSize(window.innerWidth, window.innerHeight)
}

// event listener for arrow keys
function onKeyDown(event) {
	if (event.keyCode == 37) {
		object.position.x -= 1
		camera.position.x -= 1

		console.log('left arrow key pressed')
	} else if (event.keyCode == 39) {
		object.position.x += 1
		camera.position.x += 1
		runScore += 1
		runSpan.innerHTML = `Score : ${runScore}`

		// console.log('score', scoreText)
		// createText(`Score ${object.position.x}`)
		// scoreText.position.x = +1
		console.log('right arrow key pressed')
	} else if (event.keyCode == 38) {
		getCoin()

		// create a loop to increment the position of the object
		// for (var i = 0; i < 15; i++) {
		// 	setTimeout(() => {
		// 		object.position.y += 1
		// 	}, 1000)
		// }

		// object.position.y += 15
		setTimeout(function () {
			object.position.y -= 15
		}, 500)
		object.position.y += 15

		console.log('up arrow key pressed')
	}
}

//animate

function animate() {
	requestAnimationFrame(animate)
	render()
}

function render() {
	// if (object) camera.position.x = object.position.x
	// camera.position.z = 200
	// camera.position.y += (-mouseY - camera.position.y) * 0.05
	// rotateObject()
	// animateMario()
	// createText()
	camera.lookAt(camera.position)
	// if (object) camera.lookAt(object.position)

	renderer.render(scene, camera)
}
