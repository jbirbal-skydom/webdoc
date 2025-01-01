---
title: Rust integration
---

# Rust Examples

import WasmExample from '@site/src/components/rust/WasmComponentExample';

## Rust to Wasm Example

This is an example of integrating Rust with WebAssembly.

<WasmExample />

## CodAPI

import CodeAPI from '@site/src/components/rust/CodeAPI';

Welcome to our interactive Rust tutorial! This page demonstrates how to use Rust with live code examples.

### Your First Rust Program

Let's start with a simple "Hello, World!" program:

<CodeAPI
  sandbox="rust"
  files={{
    'main.rs': `fn main() {
    println!("Hello, World!");
}`
  }}
/>


The program above demonstrates the basic structure of a Rust program. Let's break down what each part does:

1. `fn main()` - This declares the main function, the entry point of our program
2. `println!` - This is a macro that prints text to the console

### Working with Variables

Here's an example showing how to work with variables in Rust:

<CodeAPI
  sandbox="rust"
  files={{
    'main.rs': `fn main() {
    let x = 5;
    let y = 10;
    println!("x = {}, y = {}", x, y);
    println!("sum = {}", x + y);
}`
  }}
/>

### Functions in Rust

Let's explore how functions work in Rust:

<CodeAPI
  sandbox="rust"
  files={{
    'main.rs': `fn add(a: i32, b: i32) -> i32 {
    a + b  // Note: no semicolon means this is a return expression
}

fn main() {
    let result = add(5, 3);
    println!("5 + 3 = {}", result);
}`
  }}
/>

### Error Handling Example

Here's how to handle potential errors in Rust:

<CodeAPI
  sandbox="rust"
  files={{
    'main.rs': `fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err(String::from("Division by zero!"))
    } else {
        Ok(a / b)
    }
}

fn main() {
    match divide(10.0, 2.0) {
        Ok(result) => println!("10 / 2 = {}", result),
        Err(e) => println!("Error: {}", e),
    }

    match divide(10.0, 0.0) {
        Ok(result) => println!("10 / 0 = {}", result),
        Err(e) => println!("Error: {}", e),
    }
}`
  }}
/>

### Generate Image

<CodeAPI
  sandbox="rust"
  files={{
    'main.rs': `use image::{ImageBuffer, Rgb};
use base64::{encode, write::EncoderStringWriter};

fn generate_base64_picture() -> String {
    let imgx = 256;
    let imgy = 256;
    let mut img = ImageBuffer::new(imgx, imgy);

    for (x, y, pixel) in img.enumerate_pixels_mut() {
        let r = (x as u8).saturating_add(50);
        let g = (y as u8).saturating_add(100);
        let b = 200;
        *pixel = Rgb([r, g, b]);
    }

    let mut encoded_image = EncoderStringWriter::new();
    img.save_with_format(&mut encoded_image, image::ImageFormat::Png).unwrap();

    encode(encoded_image.into_inner())
}

generate_base64_picture();
`
  }}
/>


Each example above is interactive - you can modify the code and run it directly in your browser!
