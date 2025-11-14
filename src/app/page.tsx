import Image from "next/image"

const Home = () => {
                const features = [
          {
              title: "Интеллектуальный поиск",
              description:
              "Система понимает запросы на естественном языке и ищет ответы в документах."
          },
          {
              title: "Сравнение документов",
              description:
              "Автоматическое сопоставление ТЗ с инструкциями к препаратам."
          },
          {
              title: "Фармакоэкономическая аналитика",
              description:
              "Оценка эффективности и стоимости лекарственных решений."
          },
          {
              title: "Рекомендации ИИ",
              description:
              "Формирует предложения и обоснования на основе релевантных данных."
          }
          ];

          return <>
          <main className="min-h-screen bg-gray-50 flex flex-col items-center p-6">

              <Image
                  className="dark:invert"
                  src="https://nextjs.org/icons/next.svg"
                  alt="Next.js logo"
                  width={180}
                  height={38}
                  priority
              />


              {/* Hero section */}
          <section className="text-center max-w-3xl my-16">
              <h1 className="text-5xl font-bold text-secondary mb-4">RagIQ</h1>
              <p className="text-lg text-gray-700">
                  Интеллектуальная платформа для анализа фармацевтических закупок и
                  фармакоэкономических данных.
              </p>
          </section>

          {/* Features section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full my-16">
              {features.map((feature) => (
                  <div
                      key={feature.title}
                      className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
                  >
                      <h3 className="text-xl font-semibold text-secondary mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                  </div>
              ))}
          </section>

          {/* Our mission */}
          <section className="max-w-3xl text-center my-16">
              <h2 className="text-3xl text-secondary font-bold mb-4">Наша миссия</h2>
              <p>Миссия RAGIQ — сделать анализ фармацевтических закупок прозрачным, точным и интеллектуально поддержанным.
                  Мы объединяем технологии Retrieval-Augmented Generation с отраслевой экспертизой,
                  чтобы помочь специалистам принимать быстрые и обоснованные решения.</p>
          </section>

          {/* How it works */}
          <section className="max-w-3xl text-center my-16">
              <h2 className="text-3xl text-secondary font-bold mb-4">Как это работает</h2>
              <p className="text-gray-700">
                  RAGIQ использует технологии Retrieval-Augmented Generation (RAG) и
                  внутренние базы данных, чтобы быстро извлекать релевантную
                  информацию из документов, сравнивать ТЗ с инструкциями к препаратам
                  и формировать аналитические рекомендации. RAGIQ помогает экспертам
                  экономить время, снижать ошибки и принимать решения, основанные на фактах.
              </p>
          </section>
          </main>
    </>
}
      export default Home