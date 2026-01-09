import Stats from './Stats';
import Callout from './Callout';
import FileTree from './FileTree';
import Terminal from './Terminal';
import CodeBlock from './CodeBlock';

/**
 * Central library of components available for use in MDX blog posts.
 * Add new components here to make them automatically available in all blog pages.
 */
export const mdxComponents = {
    Stats,
    Callout,
    FileTree,
    Terminal,
    pre: CodeBlock, // Custom wrapper for code blocks
};

export default mdxComponents;
