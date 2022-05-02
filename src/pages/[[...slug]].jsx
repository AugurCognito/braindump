import { join } from 'path';
import Head from 'next/head';

import { getAllPaths, getPostBySlug } from '../lib/api.js';

import Link from '../components/Link.jsx';
import Rehype from '../components/Rehype.jsx';

const Note = ({ title, hast, backlinks }) => {
  return (
    <main>
      <Head>
        <title>{title}</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.28.0/themes/prism-dark.min.css" integrity="sha512-Njdz7T/p6Ud1FiTMqH87bzDxaZBsVNebOWmacBjMdgWyeIhUSFU4V52oGwo3sT+ud+lyIE98sS291/zxBfozKw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
      </Head>
      <h1>{title}</h1>
      <Rehype hast={hast} />
      {!!backlinks.length && (
        <section>
          <h2>{'Backlinks'}</h2>
          <ul>
            {backlinks.map((b) => (
              <li key={b.path}>
                <Link href={b.path}>{b.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.27.0/components/prism-core.js" integrity="sha512-jhk8ktzYxeUWJ/vx3Lzp53xE0Jgsp+UxA3wDyRSYeMBdPutgCp6jiGvTjyZm+R7cn3Lu/0MnEIR421EOdl3qAg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.27.0/plugins/autoloader/prism-autoloader.js" integrity="sha512-xDNPOLdUk1MQjfkY6Qw0HrMmu2liCO8u0jcA1Av6+KNJM1QdSP3drDCPGCVT/83UACZTLPwYyIDFH1hWNUd2ig==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    </main>
  );
};
export default Note;

export const getStaticPaths = async () => {
  const paths = await getAllPaths();
  // add '/' which is synonymous to '/index'
  paths.push('/');

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const path = '/' + join(...(params.slug || ['index']));
  const post = await getPostBySlug(path);
  const data = post.data;
  const backlinks = await Promise.all([...data.backlinks].map(getPostBySlug));
  return {
    props: {
      title: data.title || post.basename,
      hast: post.result,
      backlinks: backlinks.map((b) => ({
        path: b.path,
        title: b.data.title || b.basename,
      })),
    },
  };
};
