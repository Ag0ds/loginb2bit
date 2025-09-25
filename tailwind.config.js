/** @type {import('tailwindcss').Config} */
module.exports = {
  /**
   * A propriedade 'content' é a mais importante.
   * Ela diz ao Tailwind quais arquivos devem ser varridos para encontrar as classes
   * que você usou. Apenas as classes encontradas nestes arquivos serão incluídas
   * no CSS final, tornando o arquivo de produção muito pequeno.
   */
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    // Adicione outros diretórios se necessário, como './lib/**/*.js'
  ],

  /**
   * Na seção 'theme', você pode customizar todo o design system do Tailwind.
   * Se você define algo diretamente aqui (fora do 'extend'), você SUBSTITUI
   * a configuração padrão do Tailwind.
   */
  theme: {
    /**
     * Dentro de 'extend', você ADICIONA novas configurações ou estende as existentes
     * sem apagar as padrões do Tailwind. É a abordagem mais comum e recomendada.
     */
    extend: {
      fontFamily: {
        // Mantenha a configuração de 'sans' que já existe
        sans: ['var(--font-geist-sans)'], // ou o que estiver lá
        // Adicione a nova família de fontes 'helvetica'
        helvetica: ['Helvetica', 'Arial', 'sans-serif', "Roboto" ],
      },
      
      // Exemplo: Estendendo os espaçamentos padrão
      spacing: {
        '128': '32rem', // Adiciona a classe 'p-128', 'm-128', etc.
      },

      // Exemplo: Estendendo as imagens de fundo
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },

  /**
   * A seção 'plugins' permite que você adicione funcionalidades extras
   * através de pacotes oficiais ou da comunidade.
   */
  plugins: [
    require('@tailwindcss/forms'), // Um plugin popular para estilizar formulários com classes simples
    require('@tailwindcss/typography'), // Para estilizar blocos de texto gerados por CMS
  ],
};