"use client"

import { motion } from "framer-motion"

export function ReadContent() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col"
    >
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white">Advanced React Hooks</h1>
        <p className="text-gray-400">Learn how to use React hooks effectively in your applications</p>
      </div>

      <div className="flex-1 rounded-xl bg-gray-800/50 p-6 border border-gray-700 overflow-auto">
        <article className="prose prose-invert max-w-none">
          <h2>Introduction to React Hooks</h2>
          <p>
            Hooks are a new addition in React 16.8. They let you use state and other React features without writing a
            class. Hooks are functions that let you "hook into" React state and lifecycle features from function
            components.
          </p>

          <h3>Why Hooks?</h3>
          <p>
            Hooks solve a wide variety of seemingly unconnected problems in React that we've encountered over five years
            of writing and maintaining tens of thousands of components.
          </p>

          <ul>
            <li>
              <strong>Reusing stateful logic between components is difficult</strong>. Hooks allow you to reuse stateful
              logic without changing your component hierarchy.
            </li>
            <li>
              <strong>Complex components become hard to understand</strong>. Hooks let you split one component into
              smaller functions based on what pieces are related.
            </li>
            <li>
              <strong>Classes confuse both people and machines</strong>. Hooks let you use more of React's features
              without classes.
            </li>
          </ul>

          <h3>useState Hook</h3>
          <p>The useState hook lets you add React state to function components:</p>

          <pre className="bg-gray-900 p-4 rounded-md">
            <code className="text-gray-300">
              {`import React, { useState } from 'react';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}`}
            </code>
          </pre>

          <h3>useEffect Hook</h3>
          <p>The Effect Hook lets you perform side effects in function components:</p>

          <pre className="bg-gray-900 p-4 rounded-md">
            <code className="text-gray-300">
              {`import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    document.title = \`You clicked \${count} times\`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}`}
            </code>
          </pre>
        </article>
      </div>
    </motion.div>
  )
}

