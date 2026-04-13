import ko from "./ko";
import en from "./en";
import ja from "./ja";

const messages = {
  ko,
  en,
  ja,
};

export function getMessages(locale = "ko") {
  return messages[locale] ?? messages.ko;
}