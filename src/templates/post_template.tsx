import React, { FunctionComponent } from 'react';
import { graphql } from 'gatsby';
import Template from 'components/Common/Template';
import PostHead from 'components/Post/PostHead';
import PostContent from 'components/Post/PostContent';
import Rain from 'components/Canvas/Rain';
import DragRocket from 'components/Canvas/DragRocket';
import { FluidObject } from 'gatsby-image';

interface PostTemplateProps {
  data: {
    allMarkdownRemark: {
      edges: [
        {
          node: {
            html: string;
            frontmatter: {
              title: string;
              summary: string;
              date: string;
              categories: string[];
              thumbnail: {
                childImageSharp: {
                  fluid: FluidObject;
                };
                publicURL: string;
              };
            };
          };
        },
      ];
    };
  };
  location: {
    href: string;
  };
}

const PostTemplate: FunctionComponent<PostTemplateProps> = function ({
  data: {
    allMarkdownRemark: { edges },
  },
  location: { href },
}) {
  const {
    node: {
      html,
      frontmatter: {
        title,
        summary,
        date,
        categories,
        thumbnail: {
          childImageSharp: { fluid },
          publicURL,
        },
      },
    },
  } = edges[0];

  return (
    <Template title={title} description={summary} url={href} image={publicURL}>
      {categories.filter((element) => element === 'Rain')[0] === 'Rain' ? <Rain /> :
        categories.filter((element) => element === 'Rocket')[0] === 'Rocket' ? <DragRocket /> :
          <PostHead
            title={title}
            date={date}
            categories={categories}
            thumbnail={fluid}
          />}
      <PostContent html={html} categories={categories} />
    </Template>
  );
};

export default PostTemplate;

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
              publicURL
            }
          }
        }
      }
    }
  }
`;
