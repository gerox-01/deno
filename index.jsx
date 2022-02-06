//Como no me sirvio acá https://dash.deno.com/playground/funny-cow-40 en esta página se encuentra
//una explicación de como funciona el componente

/** @jsx React.createElement */
/** @jsxFrag React.Fragment */

import React from "https://esm.sh/react";
import { renderToString } from "https://esm.sh/react-dom/server";
import { serve } from "https://deno.land/std@0.125.0/http/server.ts";

export default function App({ pathname }) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
                body{
                    font-family: sans-serif;
                    display: grid;
                    place-content: center;
                    height: 100vh;
                    margin: 0;
                }`,
        }}
      >
      </style>
      {pathname === "/" &&
        (
          <>
            <h1>Hello World</h1>
            <button>Hola!</button>
          </>
        )}
      {pathname === "/login" && (
        <form>
          <input placeholder="Enter your username" s></input>
        </form>
      )}
    </>
  );
}

serve((req) => {
  const { url } = req;
  const { pathname } = new URL(url);

  const app = renderToString(<App pathname={pathname} />);
  return new Response(app, {
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  });
}, { port: 8000 });
