import React from "react";

const tags = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  body: "p",
  "body-small": "p",
  small: "span"
};

const sizes = {
  h1: "text-5xl font-bold sm:text-4xl",
  h2: "text-4xl font-bold sm:text-3xl",
  h3: "text-3xl font-bold sm:text-2xl",
  h4: "text-2xl font-bold sm:text-1xl",
  h5: "text-xl font-bold sm:text-lg",
  body: "text-lg sm:text-md",
  "body-small": "text-md sm:text-sm",
  small: "text-sm sm:text-xs"
};

export const TextComponent = ({ variant, children, className, as }) => {
  const sizeClasses = sizes[variant];
  const Tag = as || tags[variant];

  return <Tag className={`${sizeClasses} ${className}`}>{children}</Tag>;
};
