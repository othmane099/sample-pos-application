package com.ombdev.inventorysystemapi.repository;

import com.ombdev.inventorysystemapi.model.Sale;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleRepository extends JpaRepository<Sale, Long> {

    Page<Sale> findAllBySaleCodeContainingOrderByIdDesc(String saleCode, Pageable pageable);

}
