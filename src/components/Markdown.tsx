import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  children: string;
  className?: string;
};

export function Markdown({ children, className }: Props) {
  return (
    <div className={`prose-trip ${className ?? ""}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
