import React, { Component } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Comment from './Comment.js';
import { AUTH_TOKEN } from '../constants'
import { timeDifferenceForDate } from '../utils'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`

class Link extends Component {
  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    const comments = this.props.link.comments;

    return (
      <div className="flex mt2 items-start" style={{ marginBottom: 20}}>
        <div className="flex items-center">
          <span className="gray">{this.props.index + 1}.</span>
          {authToken && (
            <Mutation
              mutation={VOTE_MUTATION}
              variables={{ linkId: this.props.link.id }}
              update={(store, { data: { vote } }) =>
                this.props.updateStoreAfterVote(store, vote, this.props.link.id)
              }
            >
              {voteMutation => (
                <div className="ml1 gray f11" onClick={voteMutation}>
                  ▲
                </div>
              )}
            </Mutation>
          )}
        </div>
        <div className="ml1">
          <div>
            {this.props.link.description} ({this.props.link.url})
          </div>
          <div className="f6 lh-copy gray">
            {this.props.link.votes.length} votes | by{' '}
            {this.props.link.postedBy
              ? this.props.link.postedBy.name
              : 'Unknown'}{' '}
            {timeDifferenceForDate(this.props.link.createdAt)}
            {' '}
            <RouterLink to={`/${this.props.link.id}/createComment`}>comment</RouterLink>
          </div>
          {!!comments.length &&
            comments.map(({ content, id, user, createdAt }) => (
              <Comment key={id} 
                userName={user ? user.name : null} 
                createdAt={createdAt} 
                text={content} />
            ))
          }
        </div>
      </div>
    )
  }
}

export default Link