import React, { FunctionComponent } from 'react';
import { graphql } from 'gatsby';
import Template from 'components/Common/Template';

interface PostTemplateProps { }

const PostTemplate: FunctionComponent<PostTemplateProps> = function (props) {
    console.log(props);

    return <Template>Post Template</Template>;
};

export const queryMarkdownDataBySlug = graphql`
    query queryMarkdownDataBySlug($slug: String) {
        allMarkdownRemark(filter: { fields: { slug: { eq: $slug } } }) {
            edges {
                node {
                    html
                    frontmatter {
                        title
                        summary
                        date(formatString: "YYYY.MM.DD.")
                        categories
                        thumbnail {
                            childImageSharp {
                                fluid(fit: INSIDE, quality: 100) {
                                    ...GatsbyImageSharpFluid_withWebp
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;
