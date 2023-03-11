import type { SerializedStyles } from '@emotion/react';

declare module 'react' {
  interface HTMLAttributes {
    css?: SerializedStyles;
  }
}
