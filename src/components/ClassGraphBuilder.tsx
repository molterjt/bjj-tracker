import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Technique } from '../state/types';
import { getColor, getRadius } from '../constants';

interface ClassGraphBuilderProps {
  techniques: Technique[];
  selectedIds: string[];
  onToggleTechnique: (id: string) => void;
}

export default function ClassGraphBuilder({
  techniques,
  selectedIds,
  onToggleTechnique
}: ClassGraphBuilderProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || techniques.length === 0) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const width = 700;
    const height = 550;

    const nodes = techniques.map(t => ({
      id: t.id,
      name: t.name,
      category: t.paths[0]?.split(' > ')[0] || 'Other',
      isSelected: selectedIds.includes(t.id)
    }));

    const links: { source: string; target: string }[] = [];
    techniques.forEach(tech => {
      tech.relatedTechniques.forEach(relId => {
        if (techniques.find(t => t.id === relId)) {
          const linkExists = links.some(
            l => (l.source === tech.id && l.target === relId) ||
              (l.source === relId && l.target === tech.id)
          );
          if (!linkExists) {
            links.push({ source: tech.id, target: relId });
          }
        }
      });
    });

    const categoryColors: { [key: string]: string } = {
      'Position': '#3b82f6',
      'Transition': '#10b981',
      'Submission': '#ef4444'
    };

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50))
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05));

    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#4b5563')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6);

    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .style('cursor', 'pointer')
      .on('click', function (event, d: any) {
        event.stopPropagation();
        onToggleTechnique(d.id);
      })
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    node.append('circle')
      .attr('r', (d: any) => getRadius(d.category))
      .attr('fill', (d: any) => getColor(d.category))
      .attr('stroke', (d: any) => d.isSelected ? '#fbbf24' : '#1f2937')
      .attr('stroke-width', (d: any) => d.isSelected ? 4 : 2);

    // Add checkmark for selected nodes
    node.append('text')
      .text((d: any) => d.isSelected ? '✓' : '')
      .attr('x', 0)
      .attr('y', 5)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .style('pointer-events', 'none');

    node.append('text')
      .text((d: any) => d.name)
      .attr('x', 0)
      .attr('y', 35)
      .attr('text-anchor', 'middle')
      .attr('fill', '#e5e7eb')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .style('pointer-events', 'none');

    // Update positions on each tick with boundary constraints
    simulation.on('tick', () => {
      // Constrain nodes to stay within bounds
      nodes.forEach((d: any) => {
        const radius = 25;
        d.x = Math.max(radius + 10, Math.min(width - radius - 15, d.x));
        d.y = Math.max(radius + 10, Math.min(height - radius - 15, d.y));
      });

      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      const radius = 20;
      d.fx = Math.max(radius + 10, Math.min(width - radius - 10, event.x));
      d.fy = Math.max(radius + 10, Math.min(height - radius - 10, event.y));
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [techniques, selectedIds, onToggleTechnique]);

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{
        backgroundColor: '#374151',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '12px',
        fontSize: '0.875rem',
        color: '#d1d5db'
      }}>
        💡 Click nodes to add/remove techniques from this class
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <svg
          ref={svgRef}
          style={{
            border: '1px solid #374151',
            borderRadius: '8px',
            backgroundColor: '#1f2937'
          }}
        />
      </div>
    </div>
  );
}