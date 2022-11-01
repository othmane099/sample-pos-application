package com.ombdev.inventorysystemapi.model;

import com.ombdev.inventorysystemapi.response.category.CategoryResponse;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.TreeSet;

@Entity
@Setter @Getter
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String categoryCode;
    private String categoryName;
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime created_at;

    @ManyToMany(mappedBy = "categories")
    private Set<Product> products = new TreeSet<>();

    @Override
    public String toString() {
        return "Category{" +
                "name='" + categoryName + '\'' +
                '}';
    }

    public static CategoryResponse toCategoryResponse(Category category){
        if (category == null) return null;
        return new CategoryResponse(
                category.getId(),
                category.getCategoryCode(),
                category.getCategoryName()
        );
    }


}
