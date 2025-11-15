'use client'
//визуализации графа (D3 layout)
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const GraphView = ({ chunks }: any) => {
    const ref = useRef(null)

    useEffect(() => {
        if (!chunks || chunks.length === 0) return

        const nodes: any[] = []
        const links: any[] = []

        chunks.forEach((c: any) => {
            nodes.push({ id: c.id, label: 'Chunk', text: c.text })

            nodes.push({ id: c.document.name, label: 'Document' })
            links.push({ source: c.id, target: c.document.name })

            c.entities.forEach((e: any) => {
                nodes.push({ id: `${e.value}`, label: e.type })
                links.push({ source: e.value, target: c.id })
            })
        })

        // remove duplicates
        const uniqueNodes = Array.from(new Map(nodes.map(n => [n.id, n])).values())

        const svg = d3.select(ref.current)
        svg.selectAll('*').remove()

        const w = 800
        const h = 600

        const sim = d3.forceSimulation(uniqueNodes)
            .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(w / 2, h / 2))

        svg.attr('width', w).attr('height', h)

        const link = svg.append('g')
            .selectAll('line')
            .data(links)
            .enter().append('line')
            .attr('stroke', '#ccc')

        const node = svg.append('g')
            .selectAll('circle')
            .data(uniqueNodes)
            .enter().append('circle')
            .attr('r', 18)
            .attr('fill', d => d.label === 'Document' ? '#4f46e5' : d.label === 'Chunk' ? '#10b981' : '#f59e0b')
            .call(
                d3.drag()
                    .on('start', d => {
                        if (!d.active) sim.alphaTarget(0.3).restart()
                        d.subject.fx = d.subject.x
                        d.subject.fy = d.subject.y
                    })
                    .on('drag', d => {
                        d.subject.fx = d.x
                        d.subject.fy = d.y
                    })
                    .on('end', d => {
                        if (!d.active) sim.alphaTarget(0)
                        d.subject.fx = null
                        d.subject.fy = null
                    })
            )

        const labels = svg.append('g')
            .selectAll('text')
            .data(uniqueNodes)
            .enter().append('text')
            .text(d => d.id)
            .attr('font-size', 10)
            .attr('dx', 20)
            .attr('dy', 4)

        sim.on('tick', () => {
            link.attr('x1', (d: any) => d.source.x)
                .attr('y1', (d: any) => d.source.y)
                .attr('x2', (d: any) => d.target.x)
                .attr('y2', (d: any) => d.target.y)

            node.attr('cx', (d: any) => d.x)
                .attr('cy', (d: any) => d.y)

            labels.attr('x', (d: any) => d.x)
                .attr('y', (d: any) => d.y)
        })

    }, [chunks])

    return (
        <div className='mt-10'>
            <h2 className='text-xl font-semibold mb-4'>Граф</h2>
            <svg ref={ref}></svg>
        </div>
    )
}

export default GraphView
