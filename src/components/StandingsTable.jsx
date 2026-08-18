import './StandingsTable.css';

export default function StandingsTable({ standings }) {
  if (!standings || standings.length === 0) {
    return <p className="text-muted">No hay datos disponibles.</p>;
  }

  return (
    <div className="table-container glass-panel">
      <table className="standings-table">
        <thead>
          <tr>
            <th>Pos</th>
            <th>Equipo</th>
            <th>PJ</th>
            <th>G</th>
            <th>E</th>
            <th>P</th>
            <th>GF</th>
            <th>GC</th>
            <th>DIF</th>
            <th>FAL</th>
            <th>PTS</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team, index) => (
            <tr key={team.id} className={index < 3 ? 'top-team' : ''}>
              <td className="pos">{index + 1}</td>
              <td className="team-name">{team.name}</td>
              <td>{team.played}</td>
              <td>{team.won}</td>
              <td>{team.drawn}</td>
              <td>{team.lost}</td>
              <td>{team.goalsFor}</td>
              <td>{team.goalsAgainst}</td>
              <td>{team.goalsFor - team.goalsAgainst}</td>
              <td>{team.fouls || 0}</td>
              <td className="points">{team.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
