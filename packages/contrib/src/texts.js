/* eslint-disable max-len */
/* eslint-disable prettier/prettier */

import { ANSWER_STATE_LABEL } from "./constants";

function pluralize(text) {
  return text.replace(/(ée?)(?![a-z])|(ée?)$/g, "$1s");
}

export default {
  ADMIN_ANSWERS_SEARCH_PLACEHOLDER: `Rechercher par question, réponse, utilisateur ou convention…`,
  ANSWERS_INDEX_HELP_TO_DO: `Sélectionnez une question et commencez à rédiger la réponse pour vous l'attribuer :`,
  ANSWERS_INDEX_INFO_NO_DATA: state => `Il n'y a aucune réponse ${ANSWER_STATE_LABEL[state]}.`,
  ANSWERS_INDEX_INFO_NO_SEARCH_RESULT: `Cette recherche n'a retournée aucun résultat.`,
  ANSWERS_INDEX_SEARCH_PLACEHOLDER: `Rechercher par intitulé de question ou IDCC…`,
  ANSWERS_INDEX_MODAL_CANCEL: `Êtes-vous sûr d'annuler cette réponse (son contenu sera supprimé) ?`,
  ANSWERS_INDEX_TITLE: state => pluralize(`Réponses ${ANSWER_STATE_LABEL[state]}`),
};
