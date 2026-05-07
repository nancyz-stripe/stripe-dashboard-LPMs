import HomeV1 from './HomeV1';
import HomeV2 from './HomeV2';

export default function Home({ activeVersion }) {
  if (activeVersion === 'off-session') {
    return <HomeV2 />;
  }
  return <HomeV1 />;
}
