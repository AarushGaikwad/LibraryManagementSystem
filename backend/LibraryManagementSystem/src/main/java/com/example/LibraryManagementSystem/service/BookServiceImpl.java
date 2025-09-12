package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.dto.BookDto;
import com.example.LibraryManagementSystem.dto.CreateBookDto;
import com.example.LibraryManagementSystem.entity.LibraryBook;
import com.example.LibraryManagementSystem.repository.BookRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {
    private final BookRepository bookRepository;

    @Override
    public BookDto saveBook(CreateBookDto dto) {
        LibraryBook entity = new LibraryBook();
        entity.setTitle(dto.getTitle());
        entity.setAuthor(dto.getAuthor());
        // add other fields
        entity.setAvailable(true);
        LibraryBook saved = bookRepository.save(entity);
        return toBookDto(saved);
    }

    @Override
    public Optional<BookDto> findById(Long id) {
        return bookRepository.findById(id).map(this::toBookDto);
    }

    @Override
    public List<BookDto> findAll() {
        return bookRepository.findAll().stream()
                .map(this::toBookDto).toList();
    }

    @Override
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    private BookDto toBookDto(LibraryBook book) {
        BookDto dto = new BookDto();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());
        dto.setAvailable(book.getAvailable());
        dto.setQrCode(book.getQrCode());
        return dto;
    }
}
