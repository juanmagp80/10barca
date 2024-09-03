// schemas/schema.js
import schemaTypes from 'all:part:@sanity/base/schema-type';
import createSchema from 'part:@sanity/base/schema-creator';

export default createSchema({
    name: 'default',
    types: schemaTypes.concat([
        {
            name: 'news',
            title: 'News',
            type: 'document',
            fields: [
                {
                    name: 'title',
                    title: 'Title',
                    type: 'string',
                },
                {
                    name: 'content',
                    title: 'Content',
                    type: 'text',
                },
                {
                    name: 'author',
                    title: 'Author',
                    type: 'string',
                },
                {
                    name: 'publishedAt',
                    title: 'Published At',
                    type: 'datetime',
                },
            ],
        },
    ]),
});