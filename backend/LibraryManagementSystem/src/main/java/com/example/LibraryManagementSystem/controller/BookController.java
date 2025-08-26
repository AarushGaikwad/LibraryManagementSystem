package com.example.LibraryManagementSystem.controller;

import com.example.LibraryManagementSystem.dto.BookDto;
import com.example.LibraryManagementSystem.dto.CreateBookDto;
import com.example.LibraryManagementSystem.dto.UpdateBookDto;
import com.example.LibraryManagementSystem.entity.LibraryBook;
import com.example.LibraryManagementSystem.service.BookService;
import jakarta.validation.Valid;
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
    public ResponseEntity<BookDto> createBook(@Valid @RequestBody CreateBookDto dto) {
        LibraryBook savedBook = bookService.saveBook(dto);
        BookDto responseDto = convertToDto(savedBook);
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookDto> getBookById(@PathVariable Long id) {
        return bookService.findById(id)
                .map(this::convertToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<BookDto>> getAllBooks() {
        List<BookDto> books = bookService.findAll()
                .stream()
                .map(this::convertToDto)
                .toList();
        return ResponseEntity.ok(books);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookDto> updateBook(@PathVariable Long id,
                                              @Valid @RequestBody UpdateBookDto dto) {
        LibraryBook updated = bookService.updateBook(id, dto);
        return ResponseEntity.ok(convertToDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<BookDto>> searchBooks(@RequestParam String query) {
        List<BookDto> books = bookService.searchBooks(query)
                .stream()
                .map(this::convertToDto)
                .toList();
        return ResponseEntity.ok(books);
    }

    @GetMapping("/available")
    public ResponseEntity<List<BookDto>> getAvailableBooks() {
        List<BookDto> books = bookService.getAvailableBooks()
                .stream()
                .map(this::convertToDto)
                .toList();
        return ResponseEntity.ok(books);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<BookDto>> getBooksByCategory(@PathVariable String category) {
        List<BookDto> books = bookService.getBooksByCategory(category)
                .stream()
                .map(this::convertToDto)
                .toList();
        return ResponseEntity.ok(books);
    }

    private BookDto convertToDto(LibraryBook book) {
        BookDto dto = new BookDto();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());
        dto.setQrCode(book.getQrCode());
        dto.setAvailable(book.getAvailable());
        dto.setCategory(book.getCategory());
        return dto;
    }
}
