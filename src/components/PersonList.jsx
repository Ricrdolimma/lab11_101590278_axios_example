import React, { Component } from 'react';
import axios from 'axios';

export default class PersonList extends Component {
    // Define state default values.
    state = {
        persons: [],
        loading: true,
        error: null,
        expandedPerson: null
    };

    // Component lifecycle callback.
    componentDidMount() {
        this.controller = new AbortController();

        axios.get('https://randomuser.me/api/?results=10', {
            signal: this.controller.signal,
            timeout: 15000
        })
            .then(res => {
                console.log(res.data);
                const persons = res.data.results;
                this.setState({ persons, loading: false });
            })
            .catch(error => {
                if (axios.isCancel(error)) return;

                this.setState({
                    error: 'Unable to load users. Please refresh the page to try again.',
                    loading: false
                });
            });
    }

    componentWillUnmount() {
        this.controller.abort();
    }

    render() {
        const { persons, loading, error, expandedPerson } = this.state;

        if (loading) return <p role="status">Loading users…</p>;
        if (error) return <p role="alert">{error}</p>;
        if (persons.length === 0) return <p>No users found.</p>;

        return (
            <ul className="person-list">
                {persons.map(person => (
                    <li className="person-card" key={person.login.uuid}>
                        <h2>{person.name.title} {person.name.first} {person.name.last} - {person.login.uuid}</h2>
                        <div className="person-content">
                            <div className="person-photo">
                                <img src={person.picture.large} alt={`${person.name.first} ${person.name.last}`} width="200" height="200" />
                                <button
                                    type="button"
                                    aria-expanded={expandedPerson === person.login.uuid}
                                    aria-controls={`details-${person.login.uuid}`}
                                    onClick={() => this.setState({
                                        expandedPerson: expandedPerson === person.login.uuid ? null : person.login.uuid
                                    })}
                                >Details</button>
                            </div>
                            <dl className="person-info">
                                <div><dt>User Name :</dt><dd>{person.login.username}</dd></div>
                                <div><dt>Gender :</dt><dd>{person.gender.toUpperCase()}</dd></div>
                                <div><dt>Time Zone Description :</dt><dd>{person.location.timezone.description}</dd></div>
                                <div><dt>Address :</dt><dd>{person.location.street.number} {person.location.street.name}, {person.location.city}, {person.location.state} - {person.location.country} - {person.location.postcode}</dd></div>
                                <div><dt>Email :</dt><dd>{person.email}</dd></div>
                                <div><dt>Birth Date and Age :</dt><dd>{person.dob.date} ({person.dob.age})</dd></div>
                                <div><dt>Register Date :</dt><dd>{person.registered.date}</dd></div>
                                <div><dt>Phone# :</dt><dd>{person.phone}</dd></div>
                                <div><dt>Cell# :</dt><dd>{person.cell}</dd></div>
                            </dl>
                        </div>
                        {expandedPerson === person.login.uuid && (
                            <div className="person-details" id={`details-${person.login.uuid}`}>
                                <p>Nationality: {person.nat}</p>
                                <p>Coordinates: {person.location.coordinates.latitude}, {person.location.coordinates.longitude}</p>
                                <p>Time zone offset: {person.location.timezone.offset}</p>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        );
    }
}
