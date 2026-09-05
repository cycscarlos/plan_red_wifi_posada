/* ==========================================================================
   Estilos de Diagnóstico y Tarjetas de Fases (Actualizado)
   ========================================================================== */

.diagnostic-section {
  padding: 60px 0;
  background-color: #f8fafc;
}

.section-title {
  font-size: 2rem;
  color: #1e293b;
  text-align: center;
  margin-bottom: 8px;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #64748b;
  text-align: center;
  margin-bottom: 40px;
}

.grid-2-col {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.highlight-card {
  border: 2px solid #2563eb;
  background: #f0f9ff;
}

.card-header {
  margin-bottom: 16px;
}

.card-header h3 {
  font-size: 1.25rem;
  color: #0f172a;
  margin-top: 8px;
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  font-size: 0.8rem;
  font-weight: 700;
  border-radius: 20px;
  text-transform: uppercase;
}

.badge-primary {
  background-color: #e0e7ff;
  color: #3730a3;
}

.badge-success {
  background-color: #dcfce7;
  color: #166534;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  position: relative;
  padding-left: 24px;
  margin-bottom: 12px;
  font-size: 0.95rem;
  color: #334155;
  line-height: 1.5;
}

.feature-list li::before {
  content: "✓";
  position: absolute;
  left: 0;
  top: 0;
  color: #2563eb;
  font-weight: bold;
}

code {
  background-color: #e2e8f0;
  color: #0f172a;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.88em;
}
