import { Card, CardBody, CardHeader } from "@heroui/react";
import { useRef } from "react";
import Logo from "../components/Logo";
import { LoginForm } from "../components/auth/LoginForm";
import Editor from "../components/editor/Editor";

export default function HomePage() {
  const editorRef = useRef(null);
  return (
    <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-2 place-content-center">
      <div className="flex flex-col items-center justify-center">
        <Logo className="w-32" />
        <h1 className="mt-5 text-4xl">ToyHouse Admin Panel</h1>
      </div>
      <Card className="max-w-md divide-y-1 p-3">
        <CardHeader className="flex-col justify-center gap-1">
          <h3 className="text-2xl font-medium">Login</h3>
          <p className="text-sm text-default-500">Welcome back! Please login to your account.</p>
        </CardHeader>
        <CardBody>
          <LoginForm />
        </CardBody>
      </Card>
      <div className="rounded-xl border-2">
        {/* <label htmlFor="editor">Editor </label> */}
        <Editor
          ref={editorRef}
          defaultValue={
            '<h1>Heading1</h1><h2>Heading2</h2><ol><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span>Hello</li><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span>Gello</li></ol><p><strong>BOLD</strong></p><p><u>Underline</u></p><p>Italic</p><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>My name is abir</li></ol><p><br></p>'
          }
        />
      </div>
    </div>
  );
}
