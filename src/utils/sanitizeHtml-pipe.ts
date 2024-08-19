import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import * as sanitizeHtml from 'sanitize-html';

@Injectable()
export class SanitizeHtmlPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'object' && value !== null) {
      for (const key in value) {
        if (value.hasOwnProperty(key) && typeof value[key] === 'string') {
          value[key] = this.sanitize(value[key]);
        }
      }
    } else if (typeof value === 'string') {
      value = this.sanitize(value);
    }
    return value;
  }

  private sanitize(value: string): string {
    return sanitizeHtml(value, {
      allowedTags: [], // Disallow all tags
      allowedAttributes: {}, // Disallow all attributes
      disallowedTagsMode: 'discard',
    });
  }
}
