import h from 'virtual-dom/h';

// Helper to bridge transpiled JSX to hyper-script
export default function vdom(tagName, attributes, ...children) {
    return h(tagName, attributes, children);
}