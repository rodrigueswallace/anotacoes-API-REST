export interface MunicipioOption {
  value: string;
  label: string;
}

export interface MunicipiosPorUF {
  [uf: string]: MunicipioOption[];
}

/**
 * Lista estática de municípios principais por UF
 * Serve como fallback caso a API do IBGE esteja indisponível
 * Para lista completa, utilize o hook useMunicipios() que consulta a API do IBGE
 */
export const municipiosPorUF: MunicipiosPorUF = {
  'AC': [
    { value: 'cruzeiro-do-sul', label: 'Cruzeiro do Sul' },
    { value: 'rio-branco', label: 'Rio Branco' },
    { value: 'sena-madureira', label: 'Sena Madureira' }
  ],
  'AL': [
    { value: 'arapiraca', label: 'Arapiraca' },
    { value: 'maceio', label: 'Maceió' },
    { value: 'palmeira-dos-indios', label: 'Palmeira dos Índios' }
  ],
  'AP': [
    { value: 'macapa', label: 'Macapá' },
    { value: 'santana', label: 'Santana' }
  ],
  'AM': [
    { value: 'manaus', label: 'Manaus' },
    { value: 'parintins', label: 'Parintins' },
    { value: 'itacoatiara', label: 'Itacoatiara' }
  ],
  'BA': [
    { value: 'salvador', label: 'Salvador' },
    { value: 'feira-de-santana', label: 'Feira de Santana' },
    { value: 'vitoria-da-conquista', label: 'Vitória da Conquista' },
    { value: 'camaçari', label: 'Camaçari' },
    { value: 'juazeiro', label: 'Juazeiro' },
    { value: 'lauro-de-freitas', label: 'Lauro de Freitas' }
  ],
  'CE': [
    { value: 'fortaleza', label: 'Fortaleza' },
    { value: 'caucaia', label: 'Caucaia' },
    { value: 'juazeiro-do-norte', label: 'Juazeiro do Norte' },
    { value: 'sobral', label: 'Sobral' }
  ],
  'DF': [
    { value: 'brasilia', label: 'Brasília' }
  ],
  'ES': [
    { value: 'vitoria', label: 'Vitória' },
    { value: 'vila-velha', label: 'Vila Velha' },
    { value: 'cariacica', label: 'Cariacica' },
    { value: 'serra', label: 'Serra' }
  ],
  'GO': [
    { value: 'goiania', label: 'Goiânia' },
    { value: 'aparecida-de-goiania', label: 'Aparecida de Goiânia' },
    { value: 'anapolis', label: 'Anápolis' },
    { value: 'rio-verde', label: 'Rio Verde' }
  ],
  'MA': [
    { value: 'sao-luis', label: 'São Luís' },
    { value: 'imperatriz', label: 'Imperatriz' },
    { value: 'sao-jose-de-ribamar', label: 'São José de Ribamar' }
  ],
  'MT': [
    { value: 'cuiaba', label: 'Cuiabá' },
    { value: 'varzea-grande', label: 'Várzea Grande' },
    { value: 'rondonopolis', label: 'Rondonópolis' }
  ],
  'MS': [
    { value: 'campo-grande', label: 'Campo Grande' },
    { value: 'dourados', label: 'Dourados' },
    { value: 'tres-lagoas', label: 'Três Lagoas' }
  ],
  'MG': [
    { value: 'belo-horizonte', label: 'Belo Horizonte' },
    { value: 'uberlandia', label: 'Uberlândia' },
    { value: 'contagem', label: 'Contagem' },
    { value: 'juiz-de-fora', label: 'Juiz de Fora' },
    { value: 'betim', label: 'Betim' },
    { value: 'montes-claros', label: 'Montes Claros' }
  ],
  'PA': [
    { value: 'belem', label: 'Belém' },
    { value: 'ananindeua', label: 'Ananindeua' },
    { value: 'santarem', label: 'Santarém' },
    { value: 'maraba', label: 'Marabá' }
  ],
  'PB': [
    { value: 'joao-pessoa', label: 'João Pessoa' },
    { value: 'campina-grande', label: 'Campina Grande' },
    { value: 'santa-rita', label: 'Santa Rita' }
  ],
  'PR': [
    { value: 'curitiba', label: 'Curitiba' },
    { value: 'londrina', label: 'Londrina' },
    { value: 'maringa', label: 'Maringá' },
    { value: 'ponta-grossa', label: 'Ponta Grossa' },
    { value: 'cascavel', label: 'Cascavel' },
    { value: 'sao-jose-dos-pinhais', label: 'São José dos Pinhais' }
  ],
  'PE': [
    { value: 'recife', label: 'Recife' },
    { value: 'jaboatao-dos-guararapes', label: 'Jaboatão dos Guararapes' },
    { value: 'olinda', label: 'Olinda' },
    { value: 'caruaru', label: 'Caruaru' },
    { value: 'petrolina', label: 'Petrolina' }
  ],
  'PI': [
    { value: 'teresina', label: 'Teresina' },
    { value: 'parnaiba', label: 'Parnaíba' },
    { value: 'picos', label: 'Picos' }
  ],
  'RJ': [
    { value: 'rio-de-janeiro', label: 'Rio de Janeiro' },
    { value: 'sao-goncalo', label: 'São Gonçalo' },
    { value: 'duque-de-caxias', label: 'Duque de Caxias' },
    { value: 'nova-iguacu', label: 'Nova Iguaçu' },
    { value: 'niteroi', label: 'Niterói' },
    { value: 'campos-dos-goytacazes', label: 'Campos dos Goytacazes' }
  ],
  'RN': [
    { value: 'natal', label: 'Natal' },
    { value: 'mossoro', label: 'Mossoró' },
    { value: 'parnamirim', label: 'Parnamirim' }
  ],
  'RS': [
    { value: 'porto-alegre', label: 'Porto Alegre' },
    { value: 'caxias-do-sul', label: 'Caxias do Sul' },
    { value: 'pelotas', label: 'Pelotas' },
    { value: 'canoas', label: 'Canoas' },
    { value: 'santa-maria', label: 'Santa Maria' }
  ],
  'RO': [
    { value: 'porto-velho', label: 'Porto Velho' },
    { value: 'ji-parana', label: 'Ji-Paraná' },
    { value: 'ariquemes', label: 'Ariquemes' }
  ],
  'RR': [
    { value: 'boa-vista', label: 'Boa Vista' },
    { value: 'rorainopolis', label: 'Rorainópolis' }
  ],
  'SC': [
    { value: 'florianopolis', label: 'Florianópolis' },
    { value: 'joinville', label: 'Joinville' },
    { value: 'blumenau', label: 'Blumenau' },
    { value: 'sao-jose', label: 'São José' },
    { value: 'criciuma', label: 'Criciúma' }
  ],
  'SP': [
    { value: 'sao-paulo', label: 'São Paulo' },
    { value: 'guarulhos', label: 'Guarulhos' },
    { value: 'campinas', label: 'Campinas' },
    { value: 'sao-bernardo-do-campo', label: 'São Bernardo do Campo' },
    { value: 'santo-andre', label: 'Santo André' },
    { value: 'osasco', label: 'Osasco' },
    { value: 'sao-jose-dos-campos', label: 'São José dos Campos' },
    { value: 'ribeirao-preto', label: 'Ribeirão Preto' },
    { value: 'sorocaba', label: 'Sorocaba' },
    { value: 'santos', label: 'Santos' }
  ],
  'SE': [
    { value: 'aracaju', label: 'Aracaju' },
    { value: 'nossa-senhora-do-socorro', label: 'Nossa Senhora do Socorro' },
    { value: 'lagarto', label: 'Lagarto' }
  ],
  'TO': [
    { value: 'palmas', label: 'Palmas' },
    { value: 'araguaina', label: 'Araguaína' },
    { value: 'gurupi', label: 'Gurupi' }
  ]
};

export const ufOptions = [
  { value: 'AC', label: 'AC' },
  { value: 'AL', label: 'AL' },
  { value: 'AP', label: 'AP' },
  { value: 'AM', label: 'AM' },
  { value: 'BA', label: 'BA' },
  { value: 'CE', label: 'CE' },
  { value: 'DF', label: 'DF' },
  { value: 'ES', label: 'ES' },
  { value: 'GO', label: 'GO' },
  { value: 'MA', label: 'MA' },
  { value: 'MT', label: 'MT' },
  { value: 'MS', label: 'MS' },
  { value: 'MG', label: 'MG' },
  { value: 'PA', label: 'PA' },
  { value: 'PB', label: 'PB' },
  { value: 'PR', label: 'PR' },
  { value: 'PE', label: 'PE' },
  { value: 'PI', label: 'PI' },
  { value: 'RJ', label: 'RJ' },
  { value: 'RN', label: 'RN' },
  { value: 'RS', label: 'RS' },
  { value: 'RO', label: 'RO' },
  { value: 'RR', label: 'RR' },
  { value: 'SC', label: 'SC' },
  { value: 'SP', label: 'SP' },
  { value: 'SE', label: 'SE' },
  { value: 'TO', label: 'TO' }
];