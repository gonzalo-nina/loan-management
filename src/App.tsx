import React from 'react';
import { Dashboard } from './components/Dashboard';
import styled from 'styled-components';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
`;

function App() {
  return (
    <AppContainer>
      <Dashboard />
    </AppContainer>
  );
}

export default App;