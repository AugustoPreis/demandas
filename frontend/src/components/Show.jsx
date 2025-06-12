export default function Show({ visible, children }) {
  return visible ? children : null;
}