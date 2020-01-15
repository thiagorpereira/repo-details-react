import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../../services/api';

import Container from '../../components/Container';
import { Loading, Owner, IssueList } from './styles';

export default class Repository extends Component {
  // eslint-disable-next-line react/sort-comp
  // eslint-disable-next-line react/no-typos
  static PropTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  // eslint-disable-next-line react/state-in-constructor
  state = {
    repository: {}, // Only 1 repository = object
    issues: [], // Many issues = array
    loading: true,
  };

  async componentDidMount() {
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository);

    // All get will be callin same time
    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: 'open', // issues?state=open
          per_page: 5,
        },
      }),
    ]);
    console.log(repository);
    console.log(issues);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  render() {
    const { repository, issues, loading } = this.state;

    if (loading) {
      return (
        <Loading loading={loading}>
          Caregando
          <FaSpinner color="#FFF" size={14} />
        </Loading>
      );
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>
        <IssueList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_user}>{issue.title}</a>
                </strong>
              </div>
            </li>
          ))}
        </IssueList>
        Repository {repository.name} {repository.language}
      </Container>
    );
  }
}

// export default function Repository({ match }) {
//   return <h1>Repository: {decodeURIComponent(match.params.repository)} </h1>;
// }
