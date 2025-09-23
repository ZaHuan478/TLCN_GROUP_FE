import React, { useState } from "react";
import { Input } from "../../atoms/Input/Input";
import { Button } from "../../atoms/Button/Button";
import Title from "../../atoms/Title/Title";

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribed:", email);
    setEmail("");
  };

  return (
    <section className="py-12 bg-yellow-300">
      <div className="container mx-auto px-4 text-center">
        <Title level={2} className="mb-4">Subscribe to get update every new course</Title>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-3">
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
          <Button type="submit" variant="secondary">Subscribe</Button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
