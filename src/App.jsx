import React from 'react';
import PersonList from './components/PersonList.jsx';

export default function App() {
    return (
        <>
            <header className="page-header"><h1>User List</h1></header>
            <main><PersonList /></main>
        </>
    );
}
