import Header from '../../components/Header/Header'; 

export default function Admin() {
  return (
    <div>
      <Header /> 
      <main style={{ paddingTop: '100px', padding: '20px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
          Painel de Administração
        </h1>
        <p>Bem-vindo à área do administrador.</p>
      </main>
    </div>
  );
}