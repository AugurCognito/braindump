import { join } from 'path';
import Head from 'next/head';
import { useEffect } from 'react'

import { getAllPaths, getPostBySlug } from '../lib/api.js';

import Link from '../components/Link.jsx';
import Rehype from '../components/Rehype.jsx';

const Note = ({ title, hast, backlinks }) => {
  useEffect(() => {
    Prism.highlightAll()
  }, [])
  return (
    <main>
      <Head>
        <title>{title}</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.28.0/themes/prism-tomorrow.min.css" integrity="sha512-vswe+cgvic/XBoF1OcM/TeJ2FW0OofqAVdCZiEYkd6dwGXthvkSFWOoGGJgS2CW70VK5dQM5Oh+7ne47s74VTg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
      </Head>
      <article className="prose prose-sm">
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
      </article>

      <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "6255acde30064826a35892ce7fca4e86"}'></script>
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
