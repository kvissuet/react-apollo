import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { FEED_QUERY } from './LinkList'
import { LINKS_PER_PAGE } from '../constants'

const POST_MUTATION = gql`
  mutation CommentMutation($content: String!, $link: String!) {
    comment(content: $content, link: $link) {
      id
      content
    }
  }
`;

class CreateComment extends Component {
    state = {
        content: '',
    };

    render() {
        const { content } = this.state;
        const { link } = this.props.match.params;
        return (
            <div>
                <div className="flex flex-column mt3">
                    <input
                        className="mb2"
                        value={content}
                        onChange={e => this.setState({ content: e.target.value })}
                        type="text"
                        placeholder="A comment for the link"
                    />

                </div>

                <Mutation
                    mutation={POST_MUTATION}

                    variables={{ content, link }}
                    onCompleted={() => this.props.history.push('/new/1')}
                    update={(store, { data: { comment } }) => {
                        const first = LINKS_PER_PAGE;
                        const skip = 0;
                        const orderBy = 'createdAt_DESC';
                        const data = store.readQuery({
                            query: FEED_QUERY,
                            variables: { first, skip, orderBy },
                        });
                        console.log(comment);
                        const linkId = link;
                        const commentLink = data.feed.links.find(link => link.id === linkId);
                        commentLink.comments.unshift(comment);

                        store.writeQuery({
                            query: FEED_QUERY,
                            data,
                            variables: { first, skip, orderBy },
                        })
                    }}
                >
                    {postMutation => <button onClick={postMutation}>Submit</button>}
                </Mutation>
            </div>
        )
    }
}

export default CreateComment
