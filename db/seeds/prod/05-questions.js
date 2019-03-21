exports.seed = async knex => {
  global.spinner.start(`Generating questions...`)

  const questions = [
    { value: `En cas de vacances ou de création de poste, mon employeur doit-il me les proposer en priorité ?` },
    { value: `Dans ma branche, suis-je obligé d’embaucher du personnel féminin ?` },
    { value: `Dans ma branche, qu’est-il prévu en matière d’équilibre vie professionnelle, vie privée ?` },
    { value: `Quelle est la durée de ma période d’essai ?` },
    { value: `Ma période d’essai peut-elle être renouvelée ?` },
    { value: `Quelle est la durée maximale de ma période d’essai, renouvellement compris ?` },
    { value: `J’ai commencé à travailler sans signer de contrat de travail, comment être sûr de mon embauche dans l’entreprise ?` },
    { value: `Quelles informations doivent figurer dans mon contrat de travail ou ma lettre d’engagement ?` },
    { value: `Mon patron peut-il m’embaucher dans le cadre du CDI de chantier ou d’opération ?` },
    { value: `Combien de fois mon contrat peut-il être renouvelé ?` },
    { value: `Quelle est la durée maximale de mon CDD ?` },
    { value: `Quelle est la durée de carence prévue pour un CDD ?` },
    { value: `Quelles sont les modalités de calcul du délai de carence avec le CDD ?` },
    { value: `Le contrat à durée déterminée (CDD) : L’indemnité de fin de contrat peut-elle être limitée ?` },
    { value: `Quelles sont les modalités de calcul du délai de carence ?` },
    { value: `Quelles sont les garanties prévues par la mutuelle de mon entreprise ?` },
    { value: `Quelle est ma garantie d’emploi en cas de maladie ?` },
    { value: `Quelles sont les prestations prisses en charge pas la complémentaire santé ?` },
    { value: `Est-ce que je peux cumuler plusieurs emplois ?` },
    { value: `Quelle est la Durée de préavis à respecter en cas de démission pour les ouvriers?` },
    { value: `Quelle est la Durée de préavis à respecter en cas de démission pour les ETAM ?` },
    { value: `Quelle est la Durée de préavis à respecter en cas de démission pour les ingénieurs et cadres ?` },
    { value: `Quelle est la Durée de préavis à respecter en cas de licenciement pour les ouvriers ?` },
    { value: `Quelle est la Durée de préavis à respecter en cas de licenciement pour les ETAM ?` },
    { value: `Quelle est la Durée de préavis à respecter en cas de licenciement pour les ingénieurs et cadres ?` },
    { value: `Quelle est la Durée de préavis en cas de départ à la retraite pour les ouvriers ?` },
    { value: `Quelle est la Durée de préavis à respecter en cas de départ à la retraite pour les ETAM ?` },
    { value: `Quelle est la Durée de préavis à respecter en cas de départ à la retraite pour les ingénieurs et cadres ?` },
    { value: `Quelle est la Durée de préavis en cas de mise à la retraite pour les ouvriers ?` },
    { value: `Quelle est la Durée de préavis à respecter en cas de mise à la retraite pour les ETAM ?` },
    { value: `Quelle est la Durée de préavis à respecter en cas de mise à la retraite pour les ingénieurs et cadres ?` },
    { value: `Mon préavis de licenciement ou de démission doit-il être exécuté en totalité ?` },
    { value: `Mon préavis doit-il être exécuté si j’ai été licencié et que j’ai retrouvé un emploi ?` },
    { value: `J’ai démissionné et viens de retrouver un emploi. Si je suis encore en préavis, est-ce que j’ai le droit de démarrer chez mon nouvel employeur ?` },
    { value: `Est-ce que je peux rechercher un emploi au cours de mon préavis ?` },
    { value: `Si le préavis n’est pas respecté par le salarié ou l’employeur, ai-je le droit à une réparation et à quelle hauteur ?` },
    { value: `Mon arrêt maladie reporte-t-il le préavis ?` },
    { value: `Comment connaître mon ancienneté dans l’entreprise et comment se calcule-t-elle ?` },
    { value: `Ai-je droit à une prime d’ancienneté ? comment l’obtenir ?` },
    { value: `Qu’advient-il de mon contrat de travail en cas de perte de marché par mon employeur au profit d’un nouvel employeur ?` },
    { value: `Mon employeur décède, qu’advient-il de mon contrat de travail ?` },
    { value: `Quelles sont les modalités de calcul de mon indemnité départ en retraite ?` },
    { value: `Quel est le montant de mon indemnité de départ en retraite ?` },
    { value: `Quel est le montant de mon indemnité de mise en retraite ?` },
    { value: `Quelle est l’ancienneté minimale à laquelle je peux prétendre à une indemnité de licenciement ?` },
    { value: `Quelles sont les compétences professionnelles nécessaires pour être maître d’apprentissage ?` },
    { value: `Quelle qualification faut-il pour être Maître d’apprentissage ?` },
    { value: `Prime de tutorat : quelles sont les conditions d’attributions ?` },
    { value: `Quel est le montant de la prime de tutorat ?` },
    { value: `Quelles sont les conditions d’indemnisation pendant le congé de maternité ?` },
    { value: `Dans ma branche, la durée de mon congé de maternité est-elle différente que dans le code du travail ?` },
    { value: `En cas d’arrêt maladie, mon employeur doit-il assurer le maintien de mon salaire ?` },
    { value: `J’ai été malade durant mes congés payés, cela a-t-il un effet sur mes congés ?` },
  ]

  await knex('api.questions').insert(questions)

  global.spinner.succeed(`Questions generated.`)
}