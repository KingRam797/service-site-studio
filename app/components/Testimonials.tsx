import { testimonials } from "@/data/testimonials";

/**
 * Renders nothing at all until a real testimonial exists — no skeleton, no
 * "coming soon", no sample entries. It appears the moment the array is filled.
 */
export default function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section className="testimonials section" id="testimonials" aria-labelledby="testimonials-title">
      <header className="section-heading">
        <p className="eyebrow">In their words</p>
        <h2 id="testimonials-title">What the owners say.</h2>
        <p>The builds above are the work. These are the people it was built for.</p>
      </header>
      <div className="testimonial-grid">
        {testimonials.map((testimonial) => (
          <figure className="testimonial-card" key={`${testimonial.name}-${testimonial.date}`}>
            <blockquote>{testimonial.quote}</blockquote>
            <figcaption>
              <strong>{testimonial.name}</strong>
              {testimonial.projectUrl ? (
                <a href={testimonial.projectUrl} target="_blank" rel="noreferrer">
                  {testimonial.business} <span aria-hidden="true">↗</span>
                </a>
              ) : (
                <span>{testimonial.business}</span>
              )}
              <time dateTime={testimonial.date}>
                {new Date(testimonial.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </time>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
