import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <Layout>
      <section className="py-20">
        <div className="container max-w-2xl">
          <div className="rounded-2xl border border-border bg-card p-8 text-center sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">404</p>
            <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Page not found</h1>
            <p className="mt-3 text-muted-foreground">
              The page you requested does not exist or may have moved. Continue browsing active projects or return to the homepage.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link to="/">Return to Home</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/projects">Browse Projects</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
