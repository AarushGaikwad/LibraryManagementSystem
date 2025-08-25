package com.example.LibraryManagementSystem.controller;

import com.example.LibraryManagementSystem.entity.LibraryBook;
import com.example.LibraryManagementSystem.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @PostMapping
    public ResponseEntity<LibraryBook> createBook(@RequestBody LibraryBook book) {
        LibraryBook savedBook = bookService.saveBook(book);
        return ResponseEntity.ok(savedBook);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LibraryBook> getBookById(@PathVariable Long id) {
        return bookService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<LibraryBook> getAllBooks() {
        return bookService.findAll();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public List<LibraryBook> searchBooks(@RequestParam String query) {
        return bookService.searchBooks(query);
    }

    @GetMapping("/available")
    public List<LibraryBook> getAvailableBooks() {
        return bookService.getAvailableBooks();
    }

    @GetMapping("/category/{category}")
    public List<LibraryBook> getBooksByCategory(@PathVariable String category) {
        return bookService.getBooksByCategory(category);
    }
}
