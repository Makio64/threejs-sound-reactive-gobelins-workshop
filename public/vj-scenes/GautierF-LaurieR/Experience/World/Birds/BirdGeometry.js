import * as THREE from 'three'

export default class BirdGeometry extends THREE.BufferGeometry
{
    constructor(birdCount, textureWidth)
    {
        super()

        this.birdCount = birdCount
        this.textureWidth = textureWidth

        const trianglesPerBird = 3
        const triangles = birdCount * trianglesPerBird
        const points = triangles * 3

        const vertices = new THREE.BufferAttribute(new Float32Array(points * 3), 3)
        const birdColors = new THREE.BufferAttribute(new Float32Array(points * 3), 3)
        const references = new THREE.BufferAttribute(new Float32Array(points * 2), 2)
        const birdVertex = new THREE.BufferAttribute(new Float32Array(points), 1)

        this.setAttribute('position', vertices)
        this.setAttribute('birdColor', birdColors)
        this.setAttribute('reference', references)
        this.setAttribute('birdVertex', birdVertex)

        let v = 0

        const vertsPush = (...args) =>
        {
            for(const value of args)
                vertices.array[v++] = value
        }

        const wingsSpan = 20

        for(let f = 0; f < birdCount; f++)
        {
            vertsPush(
                0, 0, -20,
                0, 4, -20,
                0, 0, 30
            )

            vertsPush(
                0, 0, -15,
                -wingsSpan, 0, 0,
                0, 0, 15
            )

            vertsPush(
                0, 0, 15,
                wingsSpan, 0, 0,
                0, 0, -15
            )
        }

        for(let i = 0; i < points; i++)
        {
            const birdIndex = Math.floor(i / 9)
            const x = (birdIndex % textureWidth) / textureWidth
            const y = Math.floor(birdIndex / textureWidth) / textureWidth

            const shade = 0.35 + (birdIndex / birdCount) * 0.15
            const c = new THREE.Color(shade, shade * 0.92, shade * 0.85)

            birdColors.array[i * 3 + 0] = c.r
            birdColors.array[i * 3 + 1] = c.g
            birdColors.array[i * 3 + 2] = c.b

            references.array[i * 2] = x
            references.array[i * 2 + 1] = y

            birdVertex.array[i] = i % 9
        }

        this.scale(0.12, 0.12, 0.12)
    }
}
