const db = {
    users: [
        { id: 1, name: 'a', age: 25, email: 'jksdajflj@kdlsf.com' },
        { id: 2, name: 'b', email: 'askfj@akd.com' },
        { id: 3, name: 'c', email: 'jjnej@dkf.com', age: 36 }
    ],
    posts: [
        { id: 10, title: 'GraphQL', published: true, author: 1 },
        { id: 11, title: 'Docker', published: false, author: 2 },
        { id: 12, title: 'Sererless', published: true, author: 2 }
    ],
    comments: [
        { id: 100, text: 'commented', author: 1, postId: 10 },
        { id: 101, text: 'i am learning graphQL', author: 2, postId: 11 },
        { id: 102, text: 'Thank you for your feedback', author: 2, postId: 10 },
        { id: 103, text: 'I would rather look somewhere else', author: 3, postId: 11 }
    ]
};

export default db;