import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { X } from 'lucide-react';
import { ClassSession, Technique } from '../../state/types';
import { getColor, getRadius } from '../../constants';

interface ClassGraphModalProps {
  classSession: ClassSession;
  techniques: Technique[];
  onClose: () => void;
}

export default function ClassGraphModal({
  classSession,
  techniques,
  onClose
}: ClassGraphModalProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const width = 600;
    const height = 400;

    // Only show techniques in this class
    const classTechniques = techniques.filter(t =>
      classSession.techniqueIds.includes(t.id)
    );

    if (classTechniques.length === 0) return;

    const nodes = classTechniques.map(t => ({
      id: t.id,
      name: t.name,
      category: t.paths[0]?.split(' > ')[0] || 'Other'
    }));

    const links: { source: string; target: string }[] = [];
    classTechniques.forEach(tech => {
      tech.relatedTechniques.forEach(relId => {
        if (classTechniques.find(t => t.id === relId)) {
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
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-250))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(45))
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
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    node.append('circle')
      .attr('r', (d: any) => getRadius(d.category))
      .attr('fill', (d: any) => getColor(d.category))
      .attr('stroke', '#1f2937')
      .attr('stroke-width', 2);

    node.append('text')
      .text((d: any) => d.name)
      .attr('x', 0)
      .attr('y', 32)
      .attr('text-anchor', 'middle')
      .attr('fill', '#e5e7eb')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .style('pointer-events', 'none');

    simulation.on('tick', () => {
      nodes.forEach((d: any) => {
        const radius = 18;
        d.x = Math.max(radius + 10, Math.min(width - radius - 10, d.x));
        d.y = Math.max(radius + 10, Math.min(height - radius - 10, d.y));
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
      const radius = 18;
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
  }, [classSession, techniques]);

  const classTechniques = techniques.filter(t =>
    classSession.techniqueIds.includes(t.id)
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {new Date(classSession.date + 'T00:00:00').toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h2>
          <button onClick={onClose} className="modal-close">
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {classTechniques.length === 0 ? (
            <div className="empty-state">
              No techniques in this class
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '16px' }}>
                <p className="label">Techniques covered ({classTechniques.length}):</p>
                <div className="tag-container">
                  {classTechniques.map(tech => (
                    <span key={tech.id} className="tag-small">
                      {tech.name}
                    </span>
                  ))}
                </div>
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

              {classSession.notes && (
                <div style={{ marginTop: '16px' }}>
                  <p className="label">Notes:</p>
                  <p style={{ color: '#d1d5db', fontSize: '0.875rem', lineHeight: '1.5' }}>
                    {classSession.notes}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}