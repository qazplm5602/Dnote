import { Helmet } from 'react-helmet-async';

interface Props {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
}

const SITE_NAME = "Dnote";

export default function MetaTag({ title, description, keywords, image, url }: Props) {
    const headTitle = `${title}${title ? " - " : ""}${SITE_NAME}`;

    return <Helmet>
    <title>{headTitle}</title>

    {description && <meta name='description' content={description} />}
    {keywords && <meta name='keywords' content={keywords} />}

    <meta property='og:type' content='website' />
    <meta property='og:title' content={headTitle} />
    <meta property='og:site_name' content={SITE_NAME} />
    {description && <meta property='og:description' content={description} />}
    {image && <meta property='og:image' content={image} />}
    {url && <meta property='og:url' content={url} />}

    {url && <link rel='canonical' href={url} />}
  </Helmet>;
}