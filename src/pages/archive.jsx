import Head from 'next/head';

import { getAllPosts } from '../lib/api.js';
import Link from '../components/Link.jsx';

const Archive = ({ posts }) => {
  return (
    <main>
      <Head>
        <title>{'Archive'}</title>
      </Head>
      <h1>{'Archive'}</h1>
      <ul>
        {posts.map((p) => (
          <li key={p.path}>
            <Link href={p.path}>{p.title}</Link>
          </li>
        ))}
      </ul>
      <script async defer data-website-id="235b86bf-b8d3-4bc3-af0b-3b8a950c0a56" src="https://umami-production-dd92.up.railway.app/umami.js"></script>
    </main>
  );
};
export default Archive;

export const getStaticProps = async () => {
  const allPosts = await getAllPosts();
  const posts = allPosts
    .map((p) => ({ title: p.data.title || p.basename, path: p.path }))
    .sort((a, b) => {
      return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1;
    });
  return { props: { posts } };
};
