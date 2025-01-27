// Create breakpoints utility
export const breakpoints = {
  mobile: "320px",
  tablet: "768px",
  laptop: "1024px",
  desktop: "1440px",
};

export const device = {
  mobile: `@media (min-width: ${breakpoints.mobile})`,
  tablet: `@media (min-width: ${breakpoints.tablet})`,
  laptop: `@media (min-width: ${breakpoints.laptop})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
};
